# Ontwerp Contacten Gemeentes v1.0

## Naam

**Contacten Gemeentes**

## Hoofdprincipe

De gebruiker zoekt meestal vanuit een gemeente. Daarom is de gemeente het centrale scherm.

## Datamodel

### Gemeenten
- Gemeente
- Zorgregio

### Contactpersonen
- Naam
- Functie
- Gemeente
- Zorgregio
- Telefoon mobiel
- Telefoon vast
- E-mail
- Opmerkingen

### Moeders
- Naam
- Contactpersonen
- Opmerkingen

### Kinderen
- Naam
- Moeder
- Opmerkingen

## Navigatie

1. Start bij gemeenten.
2. Kies een gemeente.
3. Bekijk contactpersonen.
4. Open een contactpersoon.
5. Bekijk gekoppelde moeders.
6. Open moeder.
7. Bekijk kinderen.

## Belangrijke ontwerpkeuzes

- Geen aparte voornaam/achternaam.
- Geen statusveld.
- Mobiel vóór vast nummer.
- Opmerkingen direct zichtbaar bij contactpersonen.
- Gemeente is de centrale ingang.
- Eén zoekvak moet uiteindelijk zoeken in alle gegevens.

## Toekomstige koppelingen

- Microsoft Entra ID voor login.
- Microsoft Graph voor toegang tot SharePoint/Microsoft Lists.
- Azure Static Web Apps voor hosting.
- Eigen domein: `contacten.hettwentsegeluk.nl`
