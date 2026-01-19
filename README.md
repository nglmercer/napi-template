# napi-template-bun

A template for building NAPI (Node-API) native addons using Rust with Bun runtime.

## Features

- **Rust-based** native modules using `napi` crate
- **Bun runtime** support for fast development
- **Cross-platform** builds for Windows, macOS, and Linux
- **TypeScript** support with automatic type definitions
- **Modern tooling** with @napi-rs/cli

## Prerequisites

- Node.js >= 18.0.0
- Bun >= 1.0.0
- Rust toolchain (stable)

## Installation

```bash
bun install
```

## Building

### Release build
```bash
bun run build
```

### Debug build
```bash
bun run build:debug
```

## Development

Run the example development script:
```bash
bun run dev
```

## Testing

```bash
bun test
```

## Code Quality

### Format
```bash
bun run format
```

### Lint (Rust)
```bash
bun run lint
```

### Type Check
```bash
bun run type-check
```

## Cleaning

```bash
bun run clean
```

## Project Structure

- `Cargo.toml` - Rust crate configuration with NAPI dependencies
- `package.json` - Node.js package configuration with build scripts
- `src/` - Rust source code
- `examples/` - Usage examples

## Supported Platforms

- Windows (x86_64, i686)
- macOS (x86_64, aarch64)
- Linux (x86_64, aarch64)

## License

MIT

## Author

Your Name <email@example.com>
