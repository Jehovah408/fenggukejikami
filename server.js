const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 加载卡密
let keys = JSON.parse(fs.readFileSync("keys.json", "utf-8"));

app.post("/api/verify", (req, res) => {
  const inputKey = req.body.card_key;

  if (!inputKey) {
    return res.status(400).json({ success: false, msg: "卡密不能为空" });
  }

  if (keys[inputKey] && !keys[inputKey].used) {
    keys[inputKey].used = true;

    // 持久化写入（可选）
    fs.writeFileSync("keys.json", JSON.stringify(keys, null, 2));

    return res.json({ success: true, msg: "验证成功" });
  } else {
    return res.json({ success: false, msg: "卡密无效或已被使用" });
  }
});

app.listen(PORT, () => {
  console.log(`服务器已启动：http://localhost:${PORT}`);
});
