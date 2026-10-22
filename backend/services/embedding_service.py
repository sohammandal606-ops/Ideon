"""Embedding service providing vector embeddings for documents and queries.

Uses FastEmbed (BAAI/bge-small-en-v1.5) by default which runs locally on CPU
with fast ONNX runtime inference and 384-dimensional output vectors.
"""

import asyncio
from typing import Sequence

from fastembed import TextEmbedding

# Singleton instance of FastEmbed model
_fastembed_model: TextEmbedding | None = None


def get_embedding_model() -> TextEmbedding:
    """Get or initialize the shared FastEmbed text embedding model."""
    global _fastembed_model
    if _fastembed_model is None:
        _fastembed_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    return _fastembed_model


class LocalEmbeddings:
    """Embedding helper implementing synchronous and asynchronous embedding methods."""

    def __init__(self) -> None:
        self.model = get_embedding_model()

    def embed_documents(self, texts: Sequence[str]) -> list[list[float]]:
        """Compute embeddings for a list of document texts."""
        if not texts:
            return []
        embeddings_gen = self.model.embed(texts)
        return [embedding.tolist() for embedding in embeddings_gen]

    def embed_query(self, text: str) -> list[float]:
        """Compute an embedding for a single search query."""
        results = self.embed_documents([text])
        return results[0] if results else []

    async def aembed_documents(self, texts: Sequence[str]) -> list[list[float]]:
        """Asynchronously compute embeddings in a background thread."""
        return await asyncio.to_thread(self.embed_documents, texts)

    async def aembed_query(self, text: str) -> list[float]:
        """Asynchronously compute an embedding for a single query."""
        return await asyncio.to_thread(self.embed_query, text)


def get_embeddings() -> LocalEmbeddings:
    """Return an initialized LocalEmbeddings client."""
    return LocalEmbeddings()
