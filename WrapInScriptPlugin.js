const { Compilation } = require('webpack');

class WrapInScriptPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('WrapInScriptPlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'WrapInScriptPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
        },
        (assets) => {
          Object.keys(assets).forEach((assetName) => {
            const asset = assets[assetName];

            // Ensure we can retrieve the source safely
            const source = asset.source ? asset.source() : asset;

            // Wrap in <script> tags
            const wrappedSource = `<script>\n${source}\n</script>`;

            // Update asset correctly
            compilation.updateAsset(
              assetName,
              new compiler.webpack.sources.RawSource(wrappedSource)
            );
          });
        }
      );
    });
  }
}

module.exports = WrapInScriptPlugin;