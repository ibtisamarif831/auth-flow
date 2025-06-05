

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$begin
    insert into public.users (id, email,phone,is_pre_signed)
    values (new.id, new.email,new.phone,(new.raw_user_meta_data ->> 'is_pre_signed')::boolean);

    insert into public.folders (user_id, name, is_private)
    values (new.id, 'Highlights', true);
    return new;
  end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."books" (
    "book_number" integer NOT NULL,
    "title_en" "text" NOT NULL,
    "title_de" "text" NOT NULL,
    "testament" character varying(3) NOT NULL,
    "format" character varying(50),
    "identifier" character varying(50) NOT NULL,
    "language" character varying(10),
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "identifier_de" "text" DEFAULT ''::"text",
    CONSTRAINT "books_testament_check" CHECK ((("testament")::"text" = ANY (ARRAY[('OLD'::character varying)::"text", ('NEW'::character varying)::"text"])))
);


ALTER TABLE "public"."books" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."chapters" (
    "book_number" integer NOT NULL,
    "chapter_number" integer NOT NULL,
    "metadata" "jsonb",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."chapters" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" NOT NULL,
    "subscription_customer_id" "text"
);


ALTER TABLE "public"."customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exegesis_english" (
    "id" integer NOT NULL,
    "book_number" integer,
    "chapter_number" integer,
    "verse_number" integer,
    "author_name" character varying(255) NOT NULL,
    "century" character varying(20) NOT NULL,
    "ektype" integer NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "author_image" "text" DEFAULT ''::"text",
    "exegesis_id" integer,
    CONSTRAINT "exegesis_english_ektype_check" CHECK (("ektype" >= 0))
);


ALTER TABLE "public"."exegesis_english" OWNER TO "postgres";


COMMENT ON COLUMN "public"."exegesis_english"."exegesis_id" IS 'id corresponding to verse';



CREATE SEQUENCE IF NOT EXISTS "public"."exegesis_english_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exegesis_english_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exegesis_english_id_seq" OWNED BY "public"."exegesis_english"."id";



CREATE TABLE IF NOT EXISTS "public"."exegesis_german" (
    "id" integer NOT NULL,
    "book_number" integer,
    "chapter_number" integer,
    "verse_number" integer,
    "author_name" character varying(255) NOT NULL,
    "century" character varying(20) NOT NULL,
    "ektype" integer NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "author_image" "text" DEFAULT ''::"text",
    "exegesis_id" integer,
    CONSTRAINT "exegesis_german_ektype_check" CHECK (("ektype" >= 0))
);


ALTER TABLE "public"."exegesis_german" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."exegesis_german_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."exegesis_german_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."exegesis_german_id_seq" OWNED BY "public"."exegesis_german"."id";



CREATE TABLE IF NOT EXISTS "public"."exegesis_reporting" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "exegesis_id_english" integer,
    "improvement" "text" DEFAULT ''::"text",
    "user_id" "uuid" DEFAULT "gen_random_uuid"(),
    "exegesis_id_german" integer
);


ALTER TABLE "public"."exegesis_reporting" OWNER TO "postgres";


COMMENT ON TABLE "public"."exegesis_reporting" IS 'User reports about exegesis';



ALTER TABLE "public"."exegesis_reporting" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."exegesis_reporting_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."folder_items" (
    "id" integer NOT NULL,
    "folder_id" integer,
    "item_type" character varying(20) NOT NULL,
    "is_private" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "item_content" "jsonb",
    "notes" "text" DEFAULT ''::"text",
    CONSTRAINT "folder_items_item_type_check" CHECK ((("item_type")::"text" = ANY (ARRAY[('verse'::character varying)::"text", ('exegesis'::character varying)::"text", ('note'::character varying)::"text", ('library'::character varying)::"text"])))
);


ALTER TABLE "public"."folder_items" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."folder_items_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."folder_items_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."folder_items_id_seq" OWNED BY "public"."folder_items"."id";



CREATE TABLE IF NOT EXISTS "public"."folders" (
    "id" integer NOT NULL,
    "user_id" "uuid",
    "name" character varying(255) NOT NULL,
    "is_private" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."folders" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."folders_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."folders_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."folders_id_seq" OWNED BY "public"."folders"."id";



CREATE TABLE IF NOT EXISTS "public"."highlights" (
    "id" integer NOT NULL,
    "book_number" integer,
    "chapter_number" integer,
    "verse_number" integer,
    "user_id" "uuid",
    "color" character varying(20) NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."highlights" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."highlights_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."highlights_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."highlights_id_seq" OWNED BY "public"."highlights"."id";



CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" integer NOT NULL,
    "book_number" integer,
    "chapter_number" integer,
    "verse_number" integer,
    "user_id" "uuid",
    "content" "text" NOT NULL,
    "is_private" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."notes" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."notes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."notes_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."notes_id_seq" OWNED BY "public"."notes"."id";



CREATE TABLE IF NOT EXISTS "public"."pre_invites" (
    "email" "text" DEFAULT ''::"text" NOT NULL
);


ALTER TABLE "public"."pre_invites" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promo_codes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "discount" numeric,
    "max_redemptions" integer,
    "redeemed_count" integer DEFAULT 0,
    "expiry_date" timestamp without time zone NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "subscription_id" "text" NOT NULL,
    "influencer" "text",
    "platform" "text",
    "subscription_android_id" "text",
    CONSTRAINT "promo_codes_discount_check" CHECK ((("discount" > (0)::numeric) AND ("discount" <= (100)::numeric)))
);


ALTER TABLE "public"."promo_codes" OWNER TO "postgres";


COMMENT ON COLUMN "public"."promo_codes"."discount" IS 'In decimals. 10 means 10% discount';



COMMENT ON COLUMN "public"."promo_codes"."platform" IS 'ios or android';



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "username" character varying(100),
    "email" character varying(255),
    "preferences" "jsonb",
    "subscription_plan" character varying(50),
    "subscription_status" character varying(50) DEFAULT 'inactive'::character varying,
    "subscription_expiry" timestamp with time zone,
    "transaction_id" character varying(255),
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "phone" "text" DEFAULT ''::"text",
    "purchase_date" timestamp with time zone,
    "device_info" "jsonb",
    "referrer_promo" "text" DEFAULT ''::"text",
    "is_pre_signed" boolean DEFAULT false,
    "external_active" "text" DEFAULT 'inactive'::"text",
    "customer_id" "text"
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."verses" (
    "book_number" integer NOT NULL,
    "chapter_number" integer NOT NULL,
    "verse_number" integer NOT NULL,
    "text_en" "text" DEFAULT ''::"text" NOT NULL,
    "text_de" "text" DEFAULT ''::"text" NOT NULL,
    "is_encrypted" boolean DEFAULT false,
    "commentary" "jsonb",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."verses" OWNER TO "postgres";


ALTER TABLE ONLY "public"."exegesis_english" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exegesis_english_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."exegesis_german" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exegesis_german_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."folder_items" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."folder_items_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."folders" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."folders_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."highlights" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."highlights_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."notes" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."notes_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_identifier_key" UNIQUE ("identifier");



ALTER TABLE ONLY "public"."books"
    ADD CONSTRAINT "books_pkey" PRIMARY KEY ("book_number");



ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_pkey" PRIMARY KEY ("book_number", "chapter_number");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exegesis_english"
    ADD CONSTRAINT "exegesis_english_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exegesis_german"
    ADD CONSTRAINT "exegesis_german_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exegesis_reporting"
    ADD CONSTRAINT "exegesis_reporting_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."folder_items"
    ADD CONSTRAINT "folder_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."folders"
    ADD CONSTRAINT "folders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "highlights_book_number_chapter_number_verse_number_user_id_key" UNIQUE ("book_number", "chapter_number", "verse_number", "user_id");



ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "highlights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pre_invites"
    ADD CONSTRAINT "pre_invites_pkey" PRIMARY KEY ("email");



ALTER TABLE ONLY "public"."promo_codes"
    ADD CONSTRAINT "promo_codes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."promo_codes"
    ADD CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."verses"
    ADD CONSTRAINT "verses_pkey" PRIMARY KEY ("book_number", "chapter_number", "verse_number");



CREATE INDEX "idx_exegesis_verse_century_english" ON "public"."exegesis_english" USING "btree" ("book_number", "chapter_number", "verse_number", "century");



CREATE INDEX "idx_exegesis_verse_century_german" ON "public"."exegesis_german" USING "btree" ("book_number", "chapter_number", "verse_number", "century");



CREATE INDEX "idx_verses_book_chapter" ON "public"."verses" USING "btree" ("book_number", "chapter_number");



ALTER TABLE ONLY "public"."chapters"
    ADD CONSTRAINT "chapters_book_number_fkey" FOREIGN KEY ("book_number") REFERENCES "public"."books"("book_number") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."exegesis_english"
    ADD CONSTRAINT "exegesis_english_book_number_chapter_number_verse_number_fkey" FOREIGN KEY ("book_number", "chapter_number", "verse_number") REFERENCES "public"."verses"("book_number", "chapter_number", "verse_number") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exegesis_german"
    ADD CONSTRAINT "exegesis_german_book_number_chapter_number_verse_number_fkey" FOREIGN KEY ("book_number", "chapter_number", "verse_number") REFERENCES "public"."verses"("book_number", "chapter_number", "verse_number") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exegesis_reporting"
    ADD CONSTRAINT "exegesis_reporting_exegesis_id_english_fkey" FOREIGN KEY ("exegesis_id_english") REFERENCES "public"."exegesis_english"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."exegesis_reporting"
    ADD CONSTRAINT "exegesis_reporting_exegesis_id_german_fkey" FOREIGN KEY ("exegesis_id_german") REFERENCES "public"."exegesis_german"("id");



ALTER TABLE ONLY "public"."exegesis_reporting"
    ADD CONSTRAINT "exegesis_reporting_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."folder_items"
    ADD CONSTRAINT "folder_items_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."folders"
    ADD CONSTRAINT "folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "highlights_book_number_chapter_number_verse_number_fkey" FOREIGN KEY ("book_number", "chapter_number", "verse_number") REFERENCES "public"."verses"("book_number", "chapter_number", "verse_number") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."highlights"
    ADD CONSTRAINT "highlights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_book_number_chapter_number_verse_number_fkey" FOREIGN KEY ("book_number", "chapter_number", "verse_number") REFERENCES "public"."verses"("book_number", "chapter_number", "verse_number") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."verses"
    ADD CONSTRAINT "verses_book_number_chapter_number_fkey" FOREIGN KEY ("book_number", "chapter_number") REFERENCES "public"."chapters"("book_number", "chapter_number") ON DELETE CASCADE;



CREATE POLICY "Allow only auth users" ON "public"."exegesis_english" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow only auth users" ON "public"."exegesis_german" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow only auth users" ON "public"."verses" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Can update own user data." ON "public"."users" FOR UPDATE USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Can view own user data." ON "public"."users" FOR SELECT USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."books" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."folder_items" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Enable select for authenticated users only" ON "public"."chapters" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Enable users to view their own data only" ON "public"."folders" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK (( SELECT ("auth"."uid"() = "folders"."user_id")));



CREATE POLICY "Enable users to view their own data only" ON "public"."highlights" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Enable users to view their own data only" ON "public"."notes" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "admin can change" ON "public"."promo_codes" TO "service_role", "supabase_admin" USING (true) WITH CHECK (true);



ALTER TABLE "public"."books" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."chapters" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exegesis_english" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exegesis_german" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exegesis_reporting" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."folder_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."folders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."highlights" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pre_invites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."promo_codes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "to all auth" ON "public"."exegesis_reporting" TO "authenticated" USING (true) WITH CHECK (true);



ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."verses" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";


















GRANT ALL ON TABLE "public"."books" TO "anon";
GRANT ALL ON TABLE "public"."books" TO "authenticated";
GRANT ALL ON TABLE "public"."books" TO "service_role";



GRANT ALL ON TABLE "public"."chapters" TO "anon";
GRANT ALL ON TABLE "public"."chapters" TO "authenticated";
GRANT ALL ON TABLE "public"."chapters" TO "service_role";



GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";



GRANT ALL ON TABLE "public"."exegesis_english" TO "anon";
GRANT ALL ON TABLE "public"."exegesis_english" TO "authenticated";
GRANT ALL ON TABLE "public"."exegesis_english" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exegesis_english_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exegesis_english_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exegesis_english_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."exegesis_german" TO "anon";
GRANT ALL ON TABLE "public"."exegesis_german" TO "authenticated";
GRANT ALL ON TABLE "public"."exegesis_german" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exegesis_german_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exegesis_german_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exegesis_german_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."exegesis_reporting" TO "anon";
GRANT ALL ON TABLE "public"."exegesis_reporting" TO "authenticated";
GRANT ALL ON TABLE "public"."exegesis_reporting" TO "service_role";



GRANT ALL ON SEQUENCE "public"."exegesis_reporting_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exegesis_reporting_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exegesis_reporting_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."folder_items" TO "anon";
GRANT ALL ON TABLE "public"."folder_items" TO "authenticated";
GRANT ALL ON TABLE "public"."folder_items" TO "service_role";



GRANT ALL ON SEQUENCE "public"."folder_items_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."folder_items_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."folder_items_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."folders" TO "anon";
GRANT ALL ON TABLE "public"."folders" TO "authenticated";
GRANT ALL ON TABLE "public"."folders" TO "service_role";



GRANT ALL ON SEQUENCE "public"."folders_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."folders_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."folders_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."highlights" TO "anon";
GRANT ALL ON TABLE "public"."highlights" TO "authenticated";
GRANT ALL ON TABLE "public"."highlights" TO "service_role";



GRANT ALL ON SEQUENCE "public"."highlights_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."highlights_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."highlights_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notes" TO "anon";
GRANT ALL ON TABLE "public"."notes" TO "authenticated";
GRANT ALL ON TABLE "public"."notes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pre_invites" TO "anon";
GRANT ALL ON TABLE "public"."pre_invites" TO "authenticated";
GRANT ALL ON TABLE "public"."pre_invites" TO "service_role";



GRANT ALL ON TABLE "public"."promo_codes" TO "anon";
GRANT ALL ON TABLE "public"."promo_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."promo_codes" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."verses" TO "anon";
GRANT ALL ON TABLE "public"."verses" TO "authenticated";
GRANT ALL ON TABLE "public"."verses" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
