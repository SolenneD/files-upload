File Upload
==


Projet File Upload

Installation
- 

Commencer par *clone* le repository


    $ git clone https://github.com/SolenneD/files-upload.git

    
Installer npm

    $ npm install
    
    
MKCERT sur macOS

    $ brew install mkcert


Ne pas oublier de changer dans le *.env.sample* le nom des fichiers générés dans le *export SSL_KEY* et le *export SSL_CERT* 


Dans le terminal, copiez le *.env.sample* en *.env*

    $ cp .env.sample .env  
    
    
Puis

    $ source .env
    

Lancer le projet
- 

    $ node serveur.js
    
Les URLs
- 

- *https://localhost:3001/* pour upload une image
- *https://localhost:3000/images?image=nomimage.jpeg* par exemple une image existante *https://localhost:3001/images?image=8f7cdaca-8f2b-4491-ba56-a0e56052b44f.jpeg*

**Attention**

Remplir les champs **user** et **mdp** avec **toto** pour les deux.