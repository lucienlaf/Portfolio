# 🎨 Portfolio V2.0 - LAFORÊT Lucien

## 📋 Vue d'ensemble

Portfolio moderne et professionnel avec mode clair/sombre, animations Lottie et design optimisé pour vidéoprojecteur.

### ✨ Fonctionnalités

- ✅ Mode clair/sombre avec sauvegarde localStorage
- ✅ 4 animations Lottie (lazy-loaded)
- ✅ Barres de compétences animées avec data-percent modifiables
- ✅ Placeholder photo SDIS 37
- ✅ 4 projets configurables
- ✅ 4 emplacements certifications
- ✅ Formulaire de contact avec validation
- ✅ Violet optimisé pour projection
- ✅ Navigation smooth + indicateur de progression
- ✅ Scrollbar personnalisée
- ✅ 100% responsive

---

## 📁 Structure des fichiers

```
portfolio/
├── index.html          # Page principale
├── style.css           # Styles (mode clair/sombre)
├── script.js           # Interactions JavaScript
├── sendmail.php        # Envoi d'emails (optionnel)
├── assets/
│   ├── img/
│   │   ├── logos/      # Logos des compétences (PHP, HTML, CSS, etc.)
│   │   ├── votre-photo.jpg
│   │   ├── sdis37.jpg
│   │   ├── projet3.png
│   │   ├── projet4.png
│   │   ├── musculation.svg
│   │   ├── gaming.svg
│   │   ├── anime.svg
│   │   ├── family.svg
│   │   └── projects.svg
│   ├── lottie/
│   │   ├── developer.json   # Animation accueil
│   │   ├── coding.json      # Animation compétences
│   │   ├── project.json     # Animation projets
│   │   └── email.json       # Animation contact
│   └── documents/
│       └── bac-pro.pdf
└── CV - LAFORÊT Lucien.pdf
```

---


#### Logos de compétences (32x32px recommandé) :
Placer dans `assets/img/logos/` :
- `php.svg`
- `html.svg`
- `css.svg`
- `javascript.svg`
- `python.svg`
- `sql.svg`
- `csharp.svg`
- `linux.svg`
- `english.svg`

**Où télécharger les logos :**
- [SVG Repo](https://www.svgrepo.com/) - Gratuit
- [Simple Icons](https://simpleicons.org/) - Logos de marques
- [Dev Icons](https://devicon.dev/) - Icônes de développement

#### Icônes d'intérêts (80x80px) :
Placer dans `assets/img/` :
- `musculation.svg`
- `gaming.svg`
- `anime.svg`
- `family.svg`
- `projects.svg`

### 4. Ajouter les animations Lottie

Télécharger les animations JSON sur [LottieFiles](https://lottiefiles.com/) et les placer dans `assets/lottie/` :

- `developer.json` - Animation de développeur
- `coding.json` - Animation de codage
- `project.json` - Animation de projet
- `email.json` - Animation d'email

**Recherches recommandées sur LottieFiles :**
- "developer coding"
- "programming animation"
- "project management"
- "email send"

---

### Configurer l'envoi d'emails

1. Ouvrir `sendmail.php`
2. Ligne 18, remplacer :
```php
$your_email = "lucien.lafpro@gmail.com"; // Votre email
```
3. Uploader sur un hébergeur PHP avec fonction `mail()` activée

**Alternative : Utiliser un service tiers**
- [Formspree](https://formspree.io/) - Gratuit
- [EmailJS](https://www.emailjs.com/) - JavaScript only
- [Web3Forms](https://web3forms.com/) - Simple

---

## 🎯 Personnalisation du contenu

### Remplacer votre photo

Ligne 100 dans `index.html` :
```html
<div class="photo-placeholder">
    <img src="assets/img/votre-photo.jpg" alt="LAFORÊT Lucien">
</div>
```

### Ajouter la photo SDIS 37

Ligne 479 dans `index.html` :
```html
<img src="assets/img/sdis37.jpg" alt="SDIS 37">
```

### Modifier les projets

Sections **Projet 3** et **Projet 4** (lignes 385-440) :
- Remplacer les images
- Changer les titres et descriptions
- Ajouter les liens vers vos projets

### Ajouter des certifications

Sections **Certification 3** et **Certification 4** (lignes 530-570) :
- Modifier les titres
- Changer les statuts et dates
- Ajouter les liens vers les documents PDF

---

### Optimiser les images

- Compresser avec [TinyPNG](https://tinypng.com/)
- Convertir en WebP pour de meilleures performances
- Utiliser les dimensions recommandées

### Lazy-load des images

Les animations Lottie sont déjà en lazy-load.

Pour les images, ajouter l'attribut `loading="lazy"` :
```html
<img src="image.jpg" alt="Description" loading="lazy">
```

---

## 🐛 Dépannage

### Les animations Lottie ne s'affichent pas

1. Vérifier que les fichiers `.json` sont bien dans `assets/lottie/`
2. Vérifier que le CDN Lottie est chargé (ligne 9 du HTML)
3. Ouvrir la console (F12) pour voir les erreurs

### Le formulaire ne fonctionne pas

1. Vérifier que `sendmail.php` est sur un serveur PHP
2. Vérifier les logs d'erreurs du serveur
3. Tester d'abord en local avec XAMPP/WAMP

### Les logos ne s'affichent pas

Les emojis sont utilisés en fallback. Pour les logos :
1. Télécharger les SVG/PNG
2. Les placer dans `assets/img/logos/`
3. Vérifier les chemins dans le HTML

### Le mode clair/sombre ne fonctionne pas

1. Vérifier que `script.js` est bien chargé
2. Ouvrir la console pour voir les erreurs
3. Vider le cache du navigateur

---

## 📊 Checklist avant publication

- [ ] Toutes les images sont remplacées
- [ ] Photo personnelle ajoutée
- [ ] Photo SDIS 37 ajoutée
- [ ] Logos de compétences ajoutés
- [ ] Animations Lottie téléchargées
- [ ] Pourcentages de compétences ajustés
- [ ] Projets 3 et 4 complétés
- [ ] Certifications 3 et 4 remplies
- [ ] Email configuré dans sendmail.php
- [ ] CV PDF mis à jour
- [ ] Liens LinkedIn et GitHub vérifiés
- [ ] Test sur mobile
- [ ] Test sur tablette
- [ ] Test sur desktop
- [ ] Test du formulaire de contact
- [ ] Test du mode clair/sombre

---


### Easter egg

Tapez le code Konami (↑ ↑ ↓ ↓ ← → ← → B A) sur votre clavier ! 🎉

---

## 📞 Support

Pour toute question :
- Email : lucien.lafpro@gmail.com
- LinkedIn : [Lucien LAFORÊT](https://www.linkedin.com/in/lucien-laforêt-345253337)
- GitHub : [lucienlaf](https://github.com/lucienlaf)

---

## 📝 Licence

Ce portfolio est libre d'utilisation pour un usage personnel.

---

## 🙏 Crédits

- Animations : [LottieFiles](https://lottiefiles.com/)
- Icônes : [Lucide Icons](https://lucide.dev/)
- Polices : Segoe UI (système)
- Inspirations : Modern web design trends 2024-2025

---

*Portfolio V2.0 - Novembre 2025*
