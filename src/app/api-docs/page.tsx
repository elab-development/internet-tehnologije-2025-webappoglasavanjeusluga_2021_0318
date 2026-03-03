// "use client";

// import SwaggerUI from "swagger-ui-react";
// import "swagger-ui-react/swagger-ui.css";

// export default function ApiDocsPage() {
//   const spec = require("@/lib/swagger").swaggerSpec;

//   return <SwaggerUI spec={spec} />;
// }"use client";

import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  return (
    <SwaggerUI url="/api/swagger" />
  );
}