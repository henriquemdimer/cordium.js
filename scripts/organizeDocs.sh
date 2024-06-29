mv ./docs/pages/Reference/README.mdx ./docs/pages/index.mdx
echo '{ "index": "Introduction" }' >> ./docs/pages/_meta.json
echo '{ "classes": "Classes", "interfaces": "Interfaces", "type-aliases": "Type Aliases", "variables": "Variables" }' >> ./docs/pages/Reference/_meta.json
