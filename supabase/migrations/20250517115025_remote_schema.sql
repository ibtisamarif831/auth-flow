alter table "public"."authors_de" disable row level security;

alter table "public"."authors_en" disable row level security;

alter table "public"."bookmarks_bibile" add constraint "bookmarks_bibile_book_number_fkey" FOREIGN KEY (book_number) REFERENCES books(book_number) not valid;

alter table "public"."bookmarks_bibile" validate constraint "bookmarks_bibile_book_number_fkey";


