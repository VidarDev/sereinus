"use server";

// Actions PWA supprimées - Fonctionnalités PWA déplacées vers la couche présentation
// PWA est maintenant géré côté client avec React hooks et ne nécessite plus d'actions serveur

// Les anciennes actions ont été remplacées par :
// - usePWAInstall() hook pour l'installation
// - usePWAUpdate() hook pour les mises à jour
// - usePWA() hook pour l'état global

// Exemples d'utilisation dans les composants React :
// const { installApp, canInstall } = usePWA();
// const { activateUpdate, hasUpdate } = usePWA();
