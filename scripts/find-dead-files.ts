import path from "node:path";
import { globSync } from "glob";
import { Project } from "ts-morph";

const project = new Project({ tsConfigFilePath: "tsconfig.json" });
const allFiles = globSync("**/*.ts?(x)", {
  ignore: [
    "**/node_modules/**",
    "**/.next/**",
    "**/types/**",
    "**/*.d.ts",
    "**/generated/**",
  ],
});

const sourceFiles = allFiles.map((filePath) =>
  project.addSourceFileAtPath(path.resolve(filePath)),
);

const usedFiles = new Set<string>();

for (const sourceFile of sourceFiles) {
  for (const imp of sourceFile.getImportDeclarations()) {
    const spec = imp.getModuleSpecifierSourceFile();
    if (spec) usedFiles.add(spec.getFilePath());
  }
}

for (const file of sourceFiles) {
  const filePath = file.getFilePath();
  if (!usedFiles.has(filePath)) {
    console.log(
      "🛑 Possivelmente morto:",
      path.relative(process.cwd(), filePath),
    );
  }
}
