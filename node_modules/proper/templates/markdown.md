# {{=it.title}}

{{~ it.nodes :node:index}}
## {{=node.name}}

{{=node.description}}

Properties:
{{~ node.properties :pvalue:pindex}}
- {{=pvalue}}
{{~}}
{{~}}
