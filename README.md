# Frontend

## Installing and running instructions

* `npm install`
* `npm run start`
* Your default browser should open to `http://localhost:1234/`

## Tests

If you want to run tests make sure to do `npm install` first and then do `npm run test`

## Assumptions

I tried to make everything as portable as possible by saving everything as ISO dates. I guess if someone wasn't used to
MM-DD-YYYY format they may be confused but that could probably be fixed by converting to a local date or something else.
I haven't tested what deserializing old tasks is like but that could be a pain point since I don't make any attempt to fix
those and assume that all tasks saved in local storage have valid fields and are up to date.