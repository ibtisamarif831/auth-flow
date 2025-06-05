create table "public"."treasures" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "metadata" jsonb,
    "file_path" text,
    "collection_name" text,
    "language" text
);


alter table "public"."treasures" enable row level security;

CREATE UNIQUE INDEX treasures_pkey ON public.treasures USING btree (id);


alter table "public"."treasures" add constraint "treasures_pkey" PRIMARY KEY using index "treasures_pkey";

grant delete on table "public"."treasures" to "anon";

grant insert on table "public"."treasures" to "anon";

grant references on table "public"."treasures" to "anon";

grant select on table "public"."treasures" to "anon";

grant trigger on table "public"."treasures" to "anon";

grant truncate on table "public"."treasures" to "anon";

grant update on table "public"."treasures" to "anon";

grant delete on table "public"."treasures" to "authenticated";

grant insert on table "public"."treasures" to "authenticated";

grant references on table "public"."treasures" to "authenticated";

grant select on table "public"."treasures" to "authenticated";

grant trigger on table "public"."treasures" to "authenticated";

grant truncate on table "public"."treasures" to "authenticated";

grant update on table "public"."treasures" to "authenticated";

grant delete on table "public"."treasures" to "service_role";

grant insert on table "public"."treasures" to "service_role";

grant references on table "public"."treasures" to "service_role";

grant select on table "public"."treasures" to "service_role";

grant trigger on table "public"."treasures" to "service_role";

grant truncate on table "public"."treasures" to "service_role";

grant update on table "public"."treasures" to "service_role";

create policy "allow to auth"
on "public"."treasures"
as permissive
for select
to authenticated
using (true);



