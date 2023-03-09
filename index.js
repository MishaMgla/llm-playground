import { PineconeStore } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeClient } from "@pinecone-database/pinecone";
import { JSONLoader } from "langchain/document_loaders";
import * as dotenv from 'dotenv';
dotenv.config();

const pinecone = new PineconeClient();

await pinecone.init({
    environment: "us-west1-gcp",
    apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index("ada002");

const vectorStore = await PineconeStore.fromExistingIndex(
    index,
    new OpenAIEmbeddings()
);

async function uploadJsonToDB() {
    const loader = new JSONLoader(
        "json/mock.json",
        "/texts"
    );
    const docs = await loader.load();
    await vectorStore.addDocuments(docs);
    console.log('uploadJsonToDB() completed');
}

async function searchSimilar(query) {
    let res = await vectorStore.similaritySearch(query, 1);
    console.log(res)
}

// uploadJsonToDB();

searchSimilar('cosmonaut');