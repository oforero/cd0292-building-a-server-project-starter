{
  description = "Nix flake for Node.js 23 with Yarn and TypeScript using flake-utils";

  inputs = {
    # Reference Nixpkgs
    nixpkgs.url = "github:NixOS/nixpkgs";

    # Include flake-utils for multi-system support
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system: let
    # Import the Nix package set for the given system
    pkgs = import nixpkgs { inherit system; };
  in {
    # Define a development shell
    devShell = pkgs.mkShell {
      buildInputs = [
        pkgs.nodejs_23      # Node.js 23 with npm
        pkgs.yarn           # Yarn package manager
        pkgs.typescript     # TypeScript compiler
      ];

      shellHook = ''
        echo "Welcome to the Node.js 23 environment with Yarn and TypeScript!"

        # Initialize project if package.json is missing
        if [ ! -f package.json ]; then
          echo "Initializing Yarn project..."
          yarn init -y
        fi

        # Install dependencies if node_modules is missing
        if [ ! -d node_modules ]; then
          echo "Installing dependencies..."
          yarn install
        fi

        # Set up TypeScript if tsconfig.json is missing
        if [ ! -f tsconfig.json ]; then
          echo "Initializing TypeScript..."
          yarn add --dev typescript
          npx tsc --init
        fi
      '';
    };
  });
}
