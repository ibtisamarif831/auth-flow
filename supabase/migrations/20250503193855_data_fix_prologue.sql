alter table "public"."prologue_audio" drop column "language";

alter table "public"."prologue_audio" drop column "path";

alter table "public"."prologue_audio" add column "book_metadata_de" jsonb;

alter table "public"."prologue_audio" add column "book_metadata_en" jsonb;

alter table "public"."prologue_audio" add column "path_audio_de" text;

alter table "public"."prologue_audio" add column "path_audio_en" text;

alter table "public"."prologue_audio" add column "path_book_de" text;

alter table "public"."prologue_audio" add column "path_book_en" text;

alter table "public"."prologue_audio" add column "prologue_ohrid_date" text;

alter table "public"."prologue_audio" add column "teaser_english" text;

alter table "public"."prologue_audio" add column "teaser_german" text;

alter table "public"."prologue_audio" add column "title_english" text;

alter table "public"."prologue_audio" add column "title_german" text;

