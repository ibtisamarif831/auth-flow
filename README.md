## Commands to run.


First of all login to supabase

```
supabase login

```


Select the theosis dev project id and use the following command.

```
supabase link --project-ref <project-ref>

```
Run 
```
supabase start

```


Now, you can go to the editor, create tables as you want. 
After generating table, write the following command.


```
supabase db diff -f <file name>
```
Add filename that fits the table generation.

The above command will compare dev database to our local schema and generate the differences.


Now, push the changes to **DEV DB**. Careful at this step, please check the DB is DEV.


```
supabase db push
```