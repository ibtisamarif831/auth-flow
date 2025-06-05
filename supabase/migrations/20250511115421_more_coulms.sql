alter table "public"."library_books" add column "reader_category_tag_english" text default ''::text;

alter table "public"."library_books" add column "reader_category_tag_german" text default ''::text;

alter table "public"."library_books" add column "teaser_english" text;

alter table "public"."library_books" add column "teaser_german" text default ''::text;

alter table "public"."library_books" add column "theological_tag_english" text default ''::text;

alter table "public"."library_books" add column "theological_tag_german" text default ''::text;



