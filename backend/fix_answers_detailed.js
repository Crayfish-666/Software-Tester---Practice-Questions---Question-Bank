const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'exam.db');
const db = new sqlite3.Database(dbPath);

const p6_tests = [
    `// 测试数据：1901，期望结果：false (不能被4整除)\n@Test\npublic void testLeapYearPath1() {\n    boolean expected = false;\n    boolean actual = LeapYearChecker.isLeapYear(1901);\n    assertEquals("1901不是闰年，期望返回false", expected, actual);\n}`,
    `// 测试数据：1904，期望结果：true (能被4整除，不能被100整除)\n@Test\npublic void testLeapYearPath2() {\n    boolean expected = true;\n    boolean actual = LeapYearChecker.isLeapYear(1904);\n    assertEquals("1904是闰年，期望返回true", expected, actual);\n}`,
    `// 测试数据：1900，期望结果：false (能被100整除，不能被400整除)\n@Test\npublic void testLeapYearPath3() {\n    boolean expected = false;\n    boolean actual = LeapYearChecker.isLeapYear(1900);\n    assertEquals("1900不是闰年，期望返回false", expected, actual);\n}`,
    `// 测试数据：2000，期望结果：true (能被400整除)\n@Test\npublic void testLeapYearPath4() {\n    boolean expected = true;\n    boolean actual = LeapYearChecker.isLeapYear(2000);\n    assertEquals("2000是世纪闰年，期望返回true", expected, actual);\n}`
];

const p7_tests = [
    `// 测试数据：">"，期望结果："Greater than sign"\n@Test\npublic void testReadParaGreater() {\n    String expected = "Greater than sign";\n    String actual = ReadPara.ReadPara(">");\n    assertEquals("输入>时应返回Greater than sign", expected, actual);\n}`,
    `// 测试数据："="，期望结果："Equal sign"\n@Test\npublic void testReadParaEqual() {\n    String expected = "Equal sign";\n    String actual = ReadPara.ReadPara("=");\n    assertEquals("输入=时应返回Equal sign", expected, actual);\n}`,
    `// 测试数据："<"，期望结果："Less than sign"\n@Test\npublic void testReadParaLess() {\n    String expected = "Less than sign";\n    String actual = ReadPara.ReadPara("<");\n    assertEquals("输入<时应返回Less than sign", expected, actual);\n}`,
    `// 测试数据："?"，期望结果："Unknown symbol"\n@Test\npublic void testReadParaUnknown() {\n    String expected = "Unknown symbol";\n    String actual = ReadPara.ReadPara("?");\n    assertEquals("输入未知符号应返回Unknown symbol", expected, actual);\n}`
];

const p8_tests = [
    `// 测试数据：95，期望结果："A"\n@Test\npublic void testCheckGradeA() {\n    String expected = "A";\n    String actual = GradeChecker.checkGrade(95);\n    assertEquals("成绩应为A", expected, actual);\n}`,
    `// 测试数据：85，期望结果："B"\n@Test\npublic void testCheckGradeB() {\n    String expected = "B";\n    String actual = GradeChecker.checkGrade(85);\n    assertEquals("成绩应为B", expected, actual);\n}`,
    `// 测试数据：75，期望结果："C"\n@Test\npublic void testCheckGradeC() {\n    String expected = "C";\n    String actual = GradeChecker.checkGrade(75);\n    assertEquals("成绩应为C", expected, actual);\n}`,
    `// 测试数据：65，期望结果："D"\n@Test\npublic void testCheckGradeD() {\n    String expected = "D";\n    String actual = GradeChecker.checkGrade(65);\n    assertEquals("成绩应为D", expected, actual);\n}`,
    `// 测试数据：55，期望结果："F"\n@Test\npublic void testCheckGradeF() {\n    String expected = "F";\n    String actual = GradeChecker.checkGrade(55);\n    assertEquals("成绩应为F", expected, actual);\n}`
];

const p9_tests = [
    `// 测试数据：原始价格0，折扣20，期望结果：0\n@Test\npublic void testDiscountOriginalPriceZero() {\n    int expected = 0;\n    int actual = DiscountCalculator.calculateDiscount(0, 20);\n    assertEquals("原价小于等于0，期望返回0", expected, actual);\n}`,
    `// 测试数据：原始价格100，非法折扣150，期望结果：0\n@Test\npublic void testDiscountInvalidRate() {\n    int expected = 0;\n    int actual = DiscountCalculator.calculateDiscount(100, 150);\n    assertEquals("折扣率大于100或小于0，期望返回0", expected, actual);\n}`,
    `// 测试数据：原始价格100，折扣20，期望结果：80\n@Test\npublic void testDiscountValid() {\n    int expected = 80;\n    int actual = DiscountCalculator.calculateDiscount(100, 20);\n    assertEquals("正常折扣计算，100打8折期望返回80", expected, actual);\n}`
];

const p10_tests = [
    `// 测试数据：-2，期望结果：false (非正数)\n@Test\npublic void testNegativeOrZero() {\n    boolean expected = false;\n    boolean actual = NumberChecker.isEvenPositive(-2);\n    assertEquals("输入负数应返回false", expected, actual);\n}`,
    `// 测试数据：4，期望结果：true (正偶数)\n@Test\npublic void testPositiveEven() {\n    boolean expected = true;\n    boolean actual = NumberChecker.isEvenPositive(4);\n    assertEquals("输入正偶数应返回true", expected, actual);\n}`,
    `// 测试数据：3，期望结果：false (正奇数)\n@Test\npublic void testPositiveOdd() {\n    boolean expected = false;\n    boolean actual = NumberChecker.isEvenPositive(3);\n    assertEquals("输入正奇数应返回false", expected, actual);\n}`
];

db.serialize(() => {
    db.all("SELECT id, paper_id, content FROM questions WHERE type = 'text'", [], (err, rows) => {
        if (err) throw err;
        
        const stmt = db.prepare("UPDATE questions SET correct_answer = ? WHERE id = ?");
        
        rows.forEach(q => {
            let answer = null;
            if (q.paper_id === 6) {
                if (q.content.includes('第1组测试数据方法')) answer = p6_tests[0];
                if (q.content.includes('第2组测试数据方法')) answer = p6_tests[1];
                if (q.content.includes('第3组测试数据方法')) answer = p6_tests[2];
                if (q.content.includes('第4组测试数据方法')) answer = p6_tests[3];
            } else if (q.paper_id === 7) {
                if (q.content.includes('第1组测试数据方法')) answer = p7_tests[0];
                if (q.content.includes('第2组测试数据方法')) answer = p7_tests[1];
                if (q.content.includes('第3组测试数据方法')) answer = p7_tests[2];
                if (q.content.includes('第4组测试数据方法')) answer = p7_tests[3];
            } else if (q.paper_id === 8) {
                if (q.content.includes('第1组测试数据方法')) answer = p8_tests[0];
                if (q.content.includes('第2组测试数据方法')) answer = p8_tests[1];
                if (q.content.includes('第3组测试数据方法')) answer = p8_tests[2];
                if (q.content.includes('第4组测试数据方法')) answer = p8_tests[3];
                if (q.content.includes('第5组测试数据方法')) answer = p8_tests[4];
            } else if (q.paper_id === 9) {
                if (q.content.includes('第1组测试数据方法')) answer = p9_tests[0];
                if (q.content.includes('第2组测试数据方法')) answer = p9_tests[1];
                if (q.content.includes('第3组测试数据方法')) answer = p9_tests[2];
            } else if (q.paper_id === 10) {
                if (q.content.includes('第1组测试数据方法')) answer = p10_tests[0];
                if (q.content.includes('第2组测试数据方法')) answer = p10_tests[1];
                if (q.content.includes('第3组测试数据方法')) answer = p10_tests[2];
            }
            
            if (answer) {
                stmt.run(answer, q.id);
            }
        });
        
        stmt.finalize();
        console.log('Successfully updated with highly detailed test cases!');
        db.close();
    });
});
