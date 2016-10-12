
describe("Get questions", function() {
  it("get correct file", function() {
    expect(getDatafromURL(url)).toMatch("answers");
  });
  it("more then 2 questions in test", function() {
    expect(questionOBJ.length).toBeGreaterThan(2);
  });
});

describe("Dom is initialized", function() {
  it("page have title", function() {
    expect(document.body.innerHTML).toMatch("h1");
  });
});

describe("Answers may be 'true' and 'fasle'", function() {
  it("array of answers have 'true'", function() {
    expect(getAnswerCode(questionOBJ).toString()).toMatch("true");
  });
  it("array of answers have 'false'", function() {
    expect(getAnswerCode(questionOBJ).toString()).toMatch("false");
  });
});



