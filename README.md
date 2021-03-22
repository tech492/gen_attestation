# Generateur d'attestation

### ⚠️ Version des attestations exploitées : 22/03/2021 ⚠️
V 2.2.0

### En bref...
Destiné à créer facilement et en local des attestation de déplacement pour les periodes de confinement et de couvre feu.

### Fonctionnalités notables
* Tout se passe sur le téléphone, rien ne passe sur internet
* Possibilité de conserver vos données personnelles de formulaire pour réutilisation ou de les effacer en un clic
* **Créez les attestations pour vous et vos proches en 1 clic** (pratique pour les sorties en famille)
* Supprimez vos données et historiques facilement.

### Version longue
Cette application a été créé pour fonctionner sans internet. C'est une alternative hors-ligne à l'application en ligne ministerielle. Son but est de simplifier et sécuriser cette démarche administrative tout en restant respectueux du cadre légal.
Elle ne contacte aucun serveur ce qui évite toute divulgation d'activité via les logs d'ip et de cookies toujours possibles.
Ces logs sont indépendants du générateur lui même et n'apparaissent donc nulle part dans le code source.

Elle se base sur le formulaire officiel. Les données sont stockées uniquement sur le téléphone pour faciliter la génération de nouvelles attestations et sont facilement effaçables via les boutons "RAZ".

La possibilité de selectionner plusieurs motifs n'est pas un bug, c'est une règle de gestion que l'on retrouve sur l'application officielle. Elle correspond à une recommandation officielle du ministère de l'interieur lisible sur leur site :
"Vous êtes incités à limiter vos sorties aux cas limitatifs énumérés, il est donc conseillé de grouper vos sorties et il est donc possible d’indiquer plusieurs motifs."

N'hésitez pas à me faire remonter des idées d'amélioration via le bug tracker ou par mail (voir adresse dans l'onglet à propos).

Bon courage à tous !

Projet IONIC (angular / typescript / cordova)
Pour compiler cette application il suffit d'installer IONIC https://ionicframework.com/docs/intro/cli
Ainsi que la pile logicielle correspondant à votre plateforme de destination (android ou iOS)
