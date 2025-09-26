# TODO: Fix RuntimeError NG01002 in UsertiendaaddComponent

## Steps from Approved Plan

1. **[COMPLETED]** Edit `src/app/admin/tienda/usuarios/usertiendaadd/usertiendaadd.component.ts`:
   - In the `cargar_usuario()` method, updated the `setValue()` object to provide default empty strings ('') for potentially missing/undefined fields like 'telefono', 'numdoc', and 'role' using the nullish coalescing operator (`|| ''`).
   - Ensured all form controls receive explicit string values to prevent the `setValue()` assertion failure.

2. **[COMPLETED]** Update this TODO.md file to mark the edit as completed.

3. **[PENDING]** Followup: Test the component by navigating to the edit route and verifying no RuntimeError in console. Submit form to confirm functionality.
