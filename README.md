# COVID Vaccine Availability Checker
This checks the SOMOS Vaccine Availability Endpoint to check for vaccine
availability!

**NOTE**: This is currently set up for emailing a gmail address.  You'll need
to tweak the `smtpHost` value in `config.json` to have it send to another email provider.

## Instructions
1. Add `auth.json` with this content:
```json
{
  "email": "[gmail key - set up in Gmail]"
}
```
2. Edit `config.json` with:
  * Your gmail address in the `senderEmail` value.
  * Your desired search zip in the `searchZip` value
  * A unique portion of the place name in the 'searchPlaceName` value.  E.g.
    'Brandeis' was used here to find the place name Brandeis High School.
3. Run the checker with `npm start`.  It'll check the endpoint periodically,
   and if there availability, it will log that on the console, and email you
   (if I get around to implementing that part).
