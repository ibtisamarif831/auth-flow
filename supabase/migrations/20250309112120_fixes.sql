create table "public"."georgian_calender" (
    "id" uuid not null default gen_random_uuid(),
    "Date" text not null,
    "Header" text not null,
    "Fast" text not null,
    "Feasts" text not null,
    "Commemorations" text not null,
    "Readings" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."julian_calender" (
    "id" uuid not null default gen_random_uuid(),
    "Date" text not null,
    "Header" text not null,
    "Fast" text not null,
    "Feasts" text not null,
    "Commemorations" text not null,
    "Readings" text not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


create table "public"."quotes_of_the_day" (
    "id" uuid not null default gen_random_uuid(),
    "quote_text" text not null,
    "reference" character varying(255),
    "day_of_year" integer not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


CREATE UNIQUE INDEX day_of_year_unique ON public.quotes_of_the_day USING btree (day_of_year);

CREATE UNIQUE INDEX georgian_calender_pkey ON public.georgian_calender USING btree (id);

CREATE UNIQUE INDEX julian_calender_pkey ON public.julian_calender USING btree (id);

CREATE UNIQUE INDEX quotes_of_the_day_pkey ON public.quotes_of_the_day USING btree (id);

alter table "public"."georgian_calender" add constraint "georgian_calender_pkey" PRIMARY KEY using index "georgian_calender_pkey";

alter table "public"."julian_calender" add constraint "julian_calender_pkey" PRIMARY KEY using index "julian_calender_pkey";

alter table "public"."quotes_of_the_day" add constraint "quotes_of_the_day_pkey" PRIMARY KEY using index "quotes_of_the_day_pkey";

alter table "public"."quotes_of_the_day" add constraint "day_of_year_check" CHECK (((day_of_year >= 1) AND (day_of_year <= 366))) not valid;

alter table "public"."quotes_of_the_day" validate constraint "day_of_year_check";

alter table "public"."quotes_of_the_day" add constraint "day_of_year_unique" UNIQUE using index "day_of_year_unique";

grant delete on table "public"."georgian_calender" to "anon";

grant insert on table "public"."georgian_calender" to "anon";

grant references on table "public"."georgian_calender" to "anon";

grant select on table "public"."georgian_calender" to "anon";

grant trigger on table "public"."georgian_calender" to "anon";

grant truncate on table "public"."georgian_calender" to "anon";

grant update on table "public"."georgian_calender" to "anon";

grant delete on table "public"."georgian_calender" to "authenticated";

grant insert on table "public"."georgian_calender" to "authenticated";

grant references on table "public"."georgian_calender" to "authenticated";

grant select on table "public"."georgian_calender" to "authenticated";

grant trigger on table "public"."georgian_calender" to "authenticated";

grant truncate on table "public"."georgian_calender" to "authenticated";

grant update on table "public"."georgian_calender" to "authenticated";

grant delete on table "public"."georgian_calender" to "service_role";

grant insert on table "public"."georgian_calender" to "service_role";

grant references on table "public"."georgian_calender" to "service_role";

grant select on table "public"."georgian_calender" to "service_role";

grant trigger on table "public"."georgian_calender" to "service_role";

grant truncate on table "public"."georgian_calender" to "service_role";

grant update on table "public"."georgian_calender" to "service_role";

grant delete on table "public"."julian_calender" to "anon";

grant insert on table "public"."julian_calender" to "anon";

grant references on table "public"."julian_calender" to "anon";

grant select on table "public"."julian_calender" to "anon";

grant trigger on table "public"."julian_calender" to "anon";

grant truncate on table "public"."julian_calender" to "anon";

grant update on table "public"."julian_calender" to "anon";

grant delete on table "public"."julian_calender" to "authenticated";

grant insert on table "public"."julian_calender" to "authenticated";

grant references on table "public"."julian_calender" to "authenticated";

grant select on table "public"."julian_calender" to "authenticated";

grant trigger on table "public"."julian_calender" to "authenticated";

grant truncate on table "public"."julian_calender" to "authenticated";

grant update on table "public"."julian_calender" to "authenticated";

grant delete on table "public"."julian_calender" to "service_role";

grant insert on table "public"."julian_calender" to "service_role";

grant references on table "public"."julian_calender" to "service_role";

grant select on table "public"."julian_calender" to "service_role";

grant trigger on table "public"."julian_calender" to "service_role";

grant truncate on table "public"."julian_calender" to "service_role";

grant update on table "public"."julian_calender" to "service_role";

grant delete on table "public"."quotes_of_the_day" to "anon";

grant insert on table "public"."quotes_of_the_day" to "anon";

grant references on table "public"."quotes_of_the_day" to "anon";

grant select on table "public"."quotes_of_the_day" to "anon";

grant trigger on table "public"."quotes_of_the_day" to "anon";

grant truncate on table "public"."quotes_of_the_day" to "anon";

grant update on table "public"."quotes_of_the_day" to "anon";

grant delete on table "public"."quotes_of_the_day" to "authenticated";

grant insert on table "public"."quotes_of_the_day" to "authenticated";

grant references on table "public"."quotes_of_the_day" to "authenticated";

grant select on table "public"."quotes_of_the_day" to "authenticated";

grant trigger on table "public"."quotes_of_the_day" to "authenticated";

grant truncate on table "public"."quotes_of_the_day" to "authenticated";

grant update on table "public"."quotes_of_the_day" to "authenticated";

grant delete on table "public"."quotes_of_the_day" to "service_role";

grant insert on table "public"."quotes_of_the_day" to "service_role";

grant references on table "public"."quotes_of_the_day" to "service_role";

grant select on table "public"."quotes_of_the_day" to "service_role";

grant trigger on table "public"."quotes_of_the_day" to "service_role";

grant truncate on table "public"."quotes_of_the_day" to "service_role";

grant update on table "public"."quotes_of_the_day" to "service_role";


