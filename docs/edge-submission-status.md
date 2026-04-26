# Microsoft Edge Add-ons Submission Status

Last updated: 2026-04-26

## Item

- Product ID: `4b8a9e20-a3e5-45be-8719-9001590866b8`
- Status: Draft in Microsoft Partner Center.
- Draft URL: `https://partner.microsoft.com/en-us/dashboard/microsoftedge/4b8a9e20-a3e5-45be-8719-9001590866b8/listings`

## Completed

- Created new Edge extension draft.
- Uploaded package: `accessibility-snapshot-auditor-0.1.0-edge.zip`
- Package validation status: Complete.
- Declared permissions shown by Partner Center: `activeTab`, `scripting`, `storage`, `tabs`.
- Availability saved as public, all 241 markets, future markets enabled.
- Passed the package warning prompt with `Proceed anyway`.

## Warnings And Blockers

- Edge warns that `short_name` value `A11y Snapshot` exceeds 12 characters.
- English listing screenshot upload succeeded with `store-assets/edge/screenshot-640x400.png`.
- English listing logo upload currently fails in Partner Center. Observed correlation IDs:
  - `703487ca-7b77-471f-a6eb-8506a3c4518e`
  - `fe4d3f7a-b56c-4bbe-8341-11936ccc327e`
- Retried logo uploads with 300x300, 128x128, and a minimal 300x300 PNG. The logo field still failed near the end of upload.
- Generated lightweight Edge image derivatives are available in `store-assets/edge/`.

## Not Done

- English listing could not be saved because the required logo upload failed.
- Final `Publish` was not clicked.
