import { MOUNT_UP_MODULE_NAME } from './settings';

export const preloadTemplates = async function () {
  const templatePaths = [
    // Add paths to "module/XXX/templates"
    //`/modules/${MODULE_NAME}/templates/XXX.html`,
    `/modules/${MOUNT_UP_MODULE_NAME}/templates/settings.html`,
  ];

  return loadTemplates(templatePaths);
};
