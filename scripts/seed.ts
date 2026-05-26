import { syncAll } from "../src/lib/sync";

async function main() {
  console.log("Đang đồng bộ dữ liệu...");
  const result = await syncAll();
  console.log("Hoàn tất:", result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
