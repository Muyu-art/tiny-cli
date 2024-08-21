import { setupMenuGuard } from './menu';
import { setupTabsGuard } from './tabs';
import setupInfoGuard from './info';
import setupPermissionGuard from './permission';

function setupPageGuard(router: any) {
  setupPermissionGuard(router);
  setupInfoGuard(router);
  setupMenuGuard(router);
  setupTabsGuard(router);
}

export default function createRouteGuard(router: any) {
  setupPageGuard(router);
}
