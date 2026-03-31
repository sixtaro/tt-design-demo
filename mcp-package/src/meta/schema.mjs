import { z } from 'zod';

// Source location embedded in each file
export const sourceLocationSchema = z.object({
  file: z.string(),
  line: z.number().nullable(),
  column: z.number().nullable(),
  reason: z.string().optional(),
});

export const exportedFromSchema = z.object({
  components: z.union([z.string(), z.boolean()]),
  business: z.union([z.string(), z.boolean()]),
  root: z.boolean(),
});

export const componentSummarySchema = z.object({
  name: z.string(),
  category: z.string(),
  sourcePath: z.string(),
  version: z.string().nullable(),
  exportedFrom: exportedFromSchema,
});

export const exportEntrySchema = z.object({
  name: z.string(),
  category: z.string(),
  sourcePath: z.string(),
  exportedFrom: exportedFromSchema,
  preferredImport: z
    .object({
      module: z.string(),
      export: z.string(),
    })
    .nullable(),
  sourceLocations: z.array(sourceLocationSchema),
  warnings: z.array(z.string()),
});

export const apiComponentSchema = z.object({
  name: z.string(),
  category: z.string(),
  sourcePath: z.string(),
  defaultExport: z.string().nullable(),
  props: z.array(z.string()),
  defaults: z.record(z.string(), z.unknown()),
  subcomponents: z.array(z.string()),
  hasDataComponentVersion: z.boolean(),
  hasPropTypes: z.boolean(),
  sourceLocations: z.array(sourceLocationSchema),
  warnings: z.array(z.string()),
});

export const styleThemeImportSchema = z.object({
  path: z.string(),
  kind: z.string().nullable(),
});

export const styleComponentSchema = z.object({
  name: z.string(),
  category: z.string(),
  sourcePath: z.string(),
  stylePath: z.string().nullable(),
  blockClass: z.string().nullable(),
  modifierClasses: z.array(z.string()),
  relatedClasses: z.array(z.string()),
  cssVariables: z.array(z.string()),
  hardcodedColors: z.array(z.string()),
  themeImport: styleThemeImportSchema.nullable(),
  sourceLocations: z.array(sourceLocationSchema),
  warnings: z.array(z.string()),
});

export const versionFileSchema = z.object({
  generatedAt: z.string(),
  metadataSchemaVersion: z.number(),
  packageName: z.string(),
  packageVersion: z.string(),
});

export const componentsFileSchema = z.object({
  generatedAt: z.string(),
  metadataSchemaVersion: z.number(),
  packageName: z.string(),
  components: z.array(componentSummarySchema),
});

export const exportsFileSchema = z.object({
  generatedAt: z.string(),
  metadataSchemaVersion: z.number(),
  packageName: z.string(),
  components: z.array(exportEntrySchema),
});

export const apiFileSchema = z.object({
  generatedAt: z.string(),
  metadataSchemaVersion: z.number(),
  packageName: z.string(),
  components: z.array(apiComponentSchema),
});

export const stylesFileSchema = z.object({
  generatedAt: z.string(),
  metadataSchemaVersion: z.number(),
  packageName: z.string(),
  components: z.array(styleComponentSchema),
});
