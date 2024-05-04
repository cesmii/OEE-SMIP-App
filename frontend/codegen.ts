import type { CodegenConfig } from "@graphql-codegen/cli";



const config: CodegenConfig = {
    schema: "https://east.cesmii.net/graphql",
    documents: [
        "lib/graphql/**/*.graphql",
    ],
    ignoreNoDocuments: true,
    generates: {
        "./generated/graphql/operations.ts": {
            plugins: [
                "typescript",
                "typescript-operations",
                "typed-document-node",
            ],
            config: {
                strictScalars: true,
                scalars: {
                    BigInt: "string",
                    Datetime: "string",
                    JSON: "string",
                    JwtClaim: "string",
                    UUID: "string",
                },
            },
        },
    },
};

export default config;
