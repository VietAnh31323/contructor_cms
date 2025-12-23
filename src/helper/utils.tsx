import DocFileIcon from "@/components/icons/DocFileIcon";
import FolderIcon from "@/components/icons/FolderIcon";
import JpgFileIcon from "@/components/icons/JpgFileIcon";
import OutsideFolderIcon from "@/components/icons/OutsideFolderIcon";
import PdfFileIcon from "@/components/icons/PdfFileIcon";
import PngFileIcon from "@/components/icons/PngFileIcon";
import XlsFileIcon from "@/components/icons/XlsFileIcon";
import { Typography } from "@mui/material";
export const getTitleBreadcrumbs = (
  t: any,
  isView: boolean,
  isUpdate: boolean,
  isCopy?: boolean
) => {
  if (isView) return t("common:btn.detail");
  if (isCopy) return t("common:btn.add");
  if (isUpdate) return t("common:btn.edit");
  return t("common:btn.add");
};

export const getLabelByValue = (value: string | null, options: any[]) => {
  const option = options.find((opt) => opt.value === (value ?? null));
  return option ? option.label : "";
};

export const findFirstError = (errors: any): any => {
  for (const key in errors) {
    if (errors[key]?.type) {
      return key;
    }
    if (typeof errors[key] === "object" && errors[key] !== null) {
      const nestedErrorKey = findFirstError(errors[key]);
      if (nestedErrorKey) {
        return `${key}.${nestedErrorKey}`;
      }
    }
  }
  return null;
};
export const GetExtension = (src: string) => {
  const numOfDot = src?.lastIndexOf(".");
  return src?.slice(numOfDot + 1, src?.length);
};

export const ExtensionChecking = (extension: string) => {
  switch (extension) {
    case "doc":
    case "docx":
      return <DocFileIcon />;
    case "pdf":
      return <PdfFileIcon />;
    case "ppt":
    case "pptx":
      return <div>PowerPoint</div>;
    case "xls":
    case "xlsx":
      return <XlsFileIcon />;
    case "zip":
      return <div>Zip</div>;
    case "rar":
      return <div>Rar</div>;
    case "txt":
      return <div>Text</div>;
    case "png":
      return <PngFileIcon />;
    case "jpg":
    case "jpeg":
      return <JpgFileIcon />;
    case "gif":
      return <div>gif</div>;
    case "outside":
      return <OutsideFolderIcon />;
    default:
      return <FolderIcon />;
  }
};

export const extractTextFromHtml = (html: string) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent ?? "";
};
