# COVID Vaccine Availability Checker
This checks the SOMOS Vaccine Availability Endpoint to check for vaccine
availability!

**NOTE**: This is currently set up for emailing a gmail address.  You'll need
to tweak `config.json` to have it send to another email provider.

## Instructions
1. Add `auth.json` with this content:
```json
{
  "email": "[gmail key - set up in Gmail]"
}
```
2. Edit `config.json` with your gmail address in the `senderEmail` value. 
3. Run the checker with `npm start`.  It'll check the endpoint periodically,
   and email you if there is availability.
