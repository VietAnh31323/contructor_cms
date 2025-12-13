import { Typography } from "@mui/material";
import { ReactNode, useState } from "react";

type Props = {
  isFitContent?: boolean;
  breadcrumbs: {
    title: string;
    content: ReactNode;
    rightAction?: ReactNode;
    isCheckChangeToTab?: boolean;
    checkChangeToTabFn?: any;
  }[];
  tabNumber?: number;
  maxWidthTab?: number;
};

const CoreNavbar = (props: Props) => {
  const { breadcrumbs, isFitContent, tabNumber, maxWidthTab } = props;
  const [currentTab, setCurrentTab] = useState(tabNumber ?? 0);

  return (
    <div>
      <div className="flex items-center h-[40px] w-full">
        {breadcrumbs.map((item, index) => (
          <div key={index}>
            <Typography
              variant="body1"
              noWrap={!!maxWidthTab}
              sx={{
                borderTopLeftRadius: "0.375rem",
                borderTopRightRadius: "0.375rem",
                justifyContent: "center",
                padding: 1,
                minWidth: "100px",
                maxWidth: maxWidthTab ?? "120px",
                height: "40px",
                display: "flex",
                alignItems: "center",
                borderBottom: "3px solid #0078D4",
                cursor: currentTab == index ? "not-allowed" : "pointer",
                backgroundColor: currentTab == index ? "#0078D4" : undefined,
                color: currentTab == index ? "white" : undefined,
              }}
              onClick={() => {
                item.checkChangeToTabFn && item.checkChangeToTabFn();
                item?.isCheckChangeToTab !== false && setCurrentTab(index);
              }}
            >
              {item.title}
            </Typography>
          </div>
        ))}
        <div
          style={{
            borderBottom: "3px solid #0078D4",
            width: "100%",
            height: "40px",
            alignItems: "revert",
          }}
        >
          <div className="right-10 mt-2 absolute">
            {breadcrumbs[currentTab]?.rightAction}
          </div>
        </div>
      </div>
      <div
        style={{
          boxShadow: "0px 0px 8px 0px #0000000D",
          minHeight: isFitContent ? undefined : `calc( 100vh - 195px)`,
          border: "1px solid #DFE0EB",
          padding: "20px",
        }}
      >
        {breadcrumbs[currentTab]?.content}
      </div>
    </div>
  );
};

export default CoreNavbar;
