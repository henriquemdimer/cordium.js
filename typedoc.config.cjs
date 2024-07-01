/** @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions} */
module.exports = {
  entryPoints: ['./src/index.ts'],
  out: './docs/pages/Reference',
  plugin: ['typedoc-plugin-markdown'],
  parametersFormat: 'table',
  fileExtension: '.mdx',
  classPropertiesFormat: 'table',
  hidePageHeader: true,
  hideBreadcrumbs: true,
  propertyMembersFormat: 'table',
  enumMembersFormat: 'table',
  typeDeclarationFormat: 'table',
};
