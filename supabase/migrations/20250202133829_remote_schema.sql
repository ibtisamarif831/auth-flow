drop policy "admin can change" on "public"."promo_codes";

create policy "admin can change"
on "public"."promo_codes"
as permissive
for all
to supabase_admin, service_role
using (true)
with check (true);



