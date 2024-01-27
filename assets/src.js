const API_BASE_URL = "https://api.afcon.fr.to";

$.getJSON("./players.json", (data) => {
  const players = data.players;
  for (const player of players) {
    $(".players").append(
      `<div class="one column wide">
        <div class="player" data-position="bottom left" data-variation="basic">
          <div class="image">
            <img src="${player.image}"/>
          </div>
        </div>
        <div class="ui popup">
          <div class="ui yellow image label">
            ${player.name}
            <div class="detail">${player.number}</div>
          </div>
        </div>
      </div>`
    );
    $(`img.player${player.number}`).attr("src", player.image);
  }
  $(".player").popup({ inline: true });
});

$.ajax({
  type: "GET",
  url: `${API_BASE_URL}/languages`,
}).done((languages) => {
  for (const language of languages) {
    $("#languages").append(
      `<div class="item" data-value="${language.id}">${language.name}</div>`
    );
  }
  $(".ui.search.selection.dropdown").dropdown();
});

$(".ui.form").form({
  fields: {
    name: {
      identifier: "name",
      rules: [
        {
          type: "minLength[5]",
          prompt: "Name must be at least {ruleValue} characters",
        },
      ],
    },
    // email: {
    //   identifier: "email",
    //   rules: [
    //     {
    //       type: "email",
    //       prompt: "Please enter a valid email",
    //     },
    //   ],
    // },
    languageId: {
      identifier: "languageId",
      rules: [
        {
          type: "empty",
          prompt: "Please select your programming language",
        },
      ],
    },
    sourceCode: {
      identifier: "sourceCode",
      rules: [
        {
          type: "empty",
          prompt: "Please enter your source code",
        },
      ],
    },
  },
});

function getFieldValue(fieldId) {
  return $(".ui.form").form("get field", fieldId).val();
}

$(".ui.form .submit.button").api({
  url: `${API_BASE_URL}/submissions`,
  method: "POST",
  processData: false,
  contentType: "application/json",
  beforeSend: (settings) => {
    if (!$(".ui.form").form("is valid")) return false;
    settings.data = {
      // problemId: "5d162b973bff010023cd5a56",
      name: getFieldValue("name"),
      // email: getFieldValue("email"),
      // facebookProfileLink: getFieldValue("facebook"),
      languageId: Number(getFieldValue("languageId")),
      sourceCode: getFieldValue("sourceCode"),
    };
    settings.data = JSON.stringify(settings.data);

    $(".ui.form").addClass("loading");
    $(".verdict").addClass("hidden");
    return settings;
  },
  onSuccess: (data) => {
    $(".ui.form").removeClass("loading");
    $(".ui.form").form("reset");
    $(".successfully-submitted").removeClass("hidden");
    insertParam("submission", data.id);
  },
  onFailure: (response) => {
    // [TODO] handle rejection
  },
});

function insertParam(k, v) {
  const key = encodeURI(k);
  const value = encodeURI(v);
  document.location.search = [key, value].join("=");
}

function getParam(key) {
  const params = document.location.search.substring(1).split("&");
  for (const param of params) {
    const pair = param.split("=");
    if (pair[0] === key) {
      return pair[1];
    }
  }
  return null;
}

function verdictResponse(id, verdict, user) {
  let response = `<p>Submission <a href="?submission=${id}">#`;
  response += id.split("-").join("");
  response += "</a>";

  let label = "";
  if (verdict) {
    label = "red";
    if (
      verdict === "PENDING" ||
      verdict === "IN_QUEUE" ||
      verdict === "PROCESSING"
    ) {
      label = "yellow";
    } else if (verdict === "ACCEPTED") {
      label = "green";
    }
    response += ` <span class="ui ${label} label">${verdict} </span>`;
  }

  if (!verdict || label === "yellow") {
    response += ' <i class="notched circle loading icon"></i>';
  }

  response += "</p>";

  if (user) {
    response += "<p>";
    response += `<span class="ui grey text" style="margin-right: 10px;"><i class="user icon"></i>${user.name}</span> `;
    response += `<span class="ui grey text"> <i class="envelope icon"></i>${user.email}</span>`;
    response += "</p>";
  }

  return response;
}

function checkSubmission(submission) {
  $.ajax({
    type: "GET",
    url: `${API_BASE_URL}/submissions/${submission}`,
  })
    .done((res) => {
      $(".verdict").html(verdictResponse(submission, res.verdict, res.user));
      if (
        res.verdict === "PENDING" ||
        res.verdict === "IN_QUEUE" ||
        res.verdict === "PROCESSING"
      ) {
        setTimeout(() => {
          checkSubmission(submission);
        }, 5000);
      }
    })
    .fail((res) => {
      if (res.status === 404) {
        $(".verdict").html(verdictResponse(submission, "Not Found"));
      } else {
        $(".verdict").addClass("hidden");
      }
    });
}

const submission = getParam("submission");
if (submission) {
  $(".verdict").removeClass("hidden");
  $(".verdict").html(verdictResponse(submission));
  checkSubmission(submission);
}
