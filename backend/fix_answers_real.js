const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'exam.db');
const db = new sqlite3.Database(dbPath);

const p7_tests = [
    `@Test\npublic void testGreater() {\n    assertEquals("Greater than sign", ReadPara.ReadPara(">"));\n}`,
    `@Test\npublic void testEqual() {\n    assertEquals("Equal sign", ReadPara.ReadPara("="));\n}`,
    `@Test\npublic void testLess() {\n    assertEquals("Less than sign", ReadPara.ReadPara("<"));\n}`,
    `@Test\npublic void testUnknown() {\n    assertEquals("Unknown symbol", ReadPara.ReadPara("?"));\n}`
];

const p8_tests = [
    `@Test\npublic void testA() {\n    assertEquals("A", GradeChecker.checkGrade(95));\n}`,
    `@Test\npublic void testB() {\n    assertEquals("B", GradeChecker.checkGrade(85));\n}`,
    `@Test\npublic void testC() {\n    assertEquals("C", GradeChecker.checkGrade(75));\n}`,
    `@Test\npublic void testD() {\n    assertEquals("D", GradeChecker.checkGrade(65));\n}`,
    `@Test\npublic void testF() {\n    assertEquals("F", GradeChecker.checkGrade(50));\n}`
];

const p9_tests = [
    `@Test\npublic void testInvalidPrice() {\n    assertEquals(0, DiscountCalculator.calculateDiscount(0, 20));\n}`,
    `@Test\npublic void testInvalidRate() {\n    assertEquals(0, DiscountCalculator.calculateDiscount(100, 150));\n}`,
    `@Test\npublic void testValid() {\n    assertEquals(80, DiscountCalculator.calculateDiscount(100, 20));\n}`
];

const p10_tests = [
    `@Test\npublic void testNegativeOrZero() {\n    assertFalse(NumberChecker.isEvenPositive(0));\n}`,
    `@Test\npublic void testPositiveEven() {\n    assertTrue(NumberChecker.isEvenPositive(4));\n}`,
    `@Test\npublic void testPositiveOdd() {\n    assertFalse(NumberChecker.isEvenPositive(3));\n}`
];

db.serialize(() => {
    db.all("SELECT id, paper_id, content FROM questions WHERE type = 'text'", [], (err, rows) => {
        if (err) throw err;
        
        const stmt = db.prepare("UPDATE questions SET correct_answer = ? WHERE id = ?");
        
        rows.forEach(q => {
            let answer = null;
            if (q.paper_id === 7) {
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
        console.log('Successfully updated real test cases!');
        db.close();
    });
});
