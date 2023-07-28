/**
 * src/pages/orgs/OrgAdmin.tsx
 *
 * Author: Ben Siebert <hello@ben-siebert.de>
 * Copyright: Copyright (c) 2018-2023 Ben Siebert. All rights reserved.
 * License: Project License
 * Created At: 28.07.23
 *
 */
import { useParams } from "react-router";

export default function OrgAdmin() {
  const { name } = useParams<{ name: string }>();

  return <></>;
}
