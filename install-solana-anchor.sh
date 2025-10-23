#!/usr/bin/env bash
set -e

# === CONFIG ===
SOLANA_VERSION="v1.18.16"
ANCHOR_VERSION="0.30.1"
RUST_VERSION="1.86.0"

echo "🔧 Starting setup for Solana + Anchor environment..."

# === Update system packages ===
echo "📦 Updating system packages..."
sudo apt update -y
sudo apt upgrade -y
sudo apt install -y build-essential pkg-config curl git libssl-dev libclang-dev libudev-dev

# === Install Solana ===
echo "☀️ Installing Solana $SOLANA_VERSION..."
cd ~
curl -L -o solana-install-init https://github.com/solana-labs/solana/releases/download/$SOLANA_VERSION/solana-install-init-x86_64-unknown-linux-gnu
chmod +x solana-install-init
./solana-install-init $SOLANA_VERSION
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.profile
export PATH="$HOME/.cargo/bin:$PATH"
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.profile
solana --version

# === Install Rust $RUST_VERSION ===
echo "🦀 Installing Rust $RUST_VERSION..."
rustup install $RUST_VERSION
rustup override set $RUST_VERSION
rustc --version

# === Install Anchor CLI $ANCHOR_VERSION from source ===
echo "⚓ Installing Anchor CLI $ANCHOR_VERSION from source..."
rm -rf /tmp/cargo-install*
cargo install --git https://github.com/coral-xyz/anchor --tag v$ANCHOR_VERSION anchor-cli --force

# === Verify installation ===
anchor --version

# === Cleanup ===
rustup override unset

echo "✅ Solana + Anchor $ANCHOR_VERSION setup complete!"
echo "🔹 Close and reopen your terminal to apply PATH changes."