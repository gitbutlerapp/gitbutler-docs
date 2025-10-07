import { visit } from 'unist-util-visit';
import type { Code } from 'mdast';
import type { Plugin } from 'unified';

export const remarkCli: Plugin = () => {
  return (tree) => {
    visit(tree, 'code', (node: Code) => {
      // Handle both 'cli' and 'ansi' code blocks
      if (node.lang === 'cli' || node.lang === 'ansi') {
        const meta = node.meta || '';
        let hash: string | undefined;
        let height: string | undefined;

        if (node.lang === 'ansi') {
          // For ansi blocks, the meta is the hash directly
          hash = meta.trim() || undefined;
        } else {
          // For cli blocks, parse the old format [hash, height]
          const paramsMatch = meta.match(/\[([^\]]+)\]/);
          if (paramsMatch) {
            const params = paramsMatch[1].split(',').map(p => p.trim());
            hash = params[0] || undefined;
            height = params[1] || undefined;
          }
        }

        // Build attributes array
        const attributes = [];

        // Always pass the lang attribute
        attributes.push({
          type: 'mdxJsxAttribute',
          name: 'lang',
          value: node.lang
        });

        if (hash) {
          attributes.push({
            type: 'mdxJsxAttribute',
            name: 'hash',
            value: hash
          });
        }
        if (height) {
          attributes.push({
            type: 'mdxJsxAttribute',
            name: 'height',
            value: height
          });
        }

        // Transform to JSX component
        const componentNode = {
          type: 'mdxJsxFlowElement',
          name: 'CliBlock',
          attributes,
          children: [
            {
              type: 'text',
              value: node.value
            }
          ]
        };

        Object.assign(node, componentNode);
      }
    });
  };
};