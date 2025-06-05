alter table "public"."library_books" enable row level security;

create policy "allow read to user"
on "public"."library_books"
as permissive
for select
to authenticated
using (true);



