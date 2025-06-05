drop policy "allow read to user" on "public"."library_books";

create policy "allow read to user"
on "public"."library_books"
as permissive
for select
to authenticated, service_role
using (true);



