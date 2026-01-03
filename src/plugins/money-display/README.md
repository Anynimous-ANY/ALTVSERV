# Money Display & Bank Menu Plugin

Ce plugin ajoute un système d'affichage d'argent et de gestion bancaire pour votre serveur alt:V GTA 5 RP.

## Fonctionnalités

### 1. Affichage de l'argent (Money Display)
- **Position** : Bas gauche de l'écran, au-dessus de la minimap GTA 5
- **Type** : Overlay persistant (toujours visible)
- **Design** : Interface moderne avec icône d'argent et montant formaté en euros
- **Mise à jour** : Automatique en temps réel

### 2. Menu Banque (Bank Menu)
- **Ouverture** : Commande `/bank`
- **Fonctionnalités** :
  - Affichage du solde actuel
  - Dépôt d'argent
  - Retrait d'argent
  - Montants rapides (100€, 500€, 1000€, 5000€, 10000€)
  - Messages de confirmation/erreur
- **Contrôles** :
  - `ESC` pour fermer le menu
  - Boutons cliquables pour les actions

## Structure du Plugin

```
money-display/
├── client/
│   └── index.ts          # Gestion des événements client (focus, contrôles)
├── server/
│   └── index.ts          # Logique serveur (gestion argent, commandes)
├── shared/
│   └── events.ts         # Événements partagés entre client/serveur
└── webview/
    ├── MoneyDisplay.vue  # Composant d'affichage de l'argent
    └── BankMenu.vue      # Composant du menu banque
```

## Utilisation

### Pour les Joueurs

1. **Voir son argent** : L'affichage est automatique dès la connexion
2. **Ouvrir la banque** : Tapez `/bank` dans le chat
3. **Déposer de l'argent** : 
   - Entrez le montant ou utilisez les boutons rapides
   - Cliquez sur "Déposer"
4. **Retirer de l'argent** :
   - Entrez le montant ou utilisez les boutons rapides
   - Cliquez sur "Retirer"

### Pour les Développeurs

#### API Serveur

Le plugin expose une API pour manipuler l'argent des joueurs :

```typescript
import { useRebar } from '@Server/index.js';

const Rebar = useRebar();
const moneyAPI = Rebar.usePlugin('money-api');

// Obtenir l'argent d'un joueur
const currentMoney = moneyAPI.getPlayerMoney(player);

// Définir l'argent d'un joueur
await moneyAPI.setPlayerMoney(player, 5000);

// Ajouter de l'argent
await moneyAPI.addPlayerMoney(player, 100);

// Retirer de l'argent
const success = await moneyAPI.removePlayerMoney(player, 50);

// Mettre à jour l'affichage manuellement
moneyAPI.updatePlayerMoney(player, newAmount);
```

#### Événements

**Serveur → Client :**
- `money:toClient:openBankMenu` - Ouvre le menu banque
- `money:toClient:closeBankMenu` - Ferme le menu banque

**Client → Serveur :**
- `money:toServer:openBank` - Demande d'ouverture du menu
- `money:toServer:closeBank` - Demande de fermeture du menu
- `money:toServer:deposit` - Effectue un dépôt
- `money:toServer:withdraw` - Effectue un retrait

**Serveur → Webview :**
- `money:toWebview:updateMoney` - Met à jour l'affichage de l'argent

## Stockage des Données

L'argent du joueur est stocké dans le document de personnage sous la clé `money`. Il est automatiquement sauvegardé avec le système ReBar.

## Configuration

Aucune configuration n'est nécessaire. Le plugin fonctionne immédiatement après installation.

## Notes Techniques

- **Framework** : ReBar pour alt:V
- **Frontend** : Vue 3 + TailwindCSS
- **Validation** : Tous les montants sont validés côté serveur
- **Sécurité** : Les contrôles de jeu sont désactivés lors de l'utilisation du menu
- **Callbacks** : Tous les événements ont des callbacks pour éviter les erreurs

## Améliorations Futures Possibles

- [ ] Système de banque avec compte bancaire séparé
- [ ] Transferts entre joueurs
- [ ] Historique des transactions
- [ ] Intérêts bancaires
- [ ] Frais de transaction
- [ ] Limite de retrait journalier
- [ ] Cartes de crédit/débit
