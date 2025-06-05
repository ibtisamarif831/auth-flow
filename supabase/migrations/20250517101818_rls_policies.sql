create policy "Enable read access for all users"
on "public"."theosis_highlights_de"
as permissive
for select
to authenticated
using (true);


create policy "Enable read access for all users"
on "public"."theosis_highlights_en"
as permissive
for select
to authenticated
using (true);



