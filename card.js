#!/usr/bin/env node

"use strict";

const boxen = require("boxen");
const chalk = require("chalk");
const open = require("open");
const fs = require("fs");
const request = require("request");
const path = require("path");
const ora = require("ora");
const cliSpinners = require("cli-spinners");
const { prompt } = require("enquirer");

// Load user data from data.json
const res = fs.readFileSync(path.resolve(__dirname, "data.json"));
const user_data = JSON.parse(res);

const main = async () => {
    const {
        user_name,
        user_email,
        twitter_username,
        linkedin_username,
        github_username,
        personal_site,
        npx_card_handle,
        job_title,
        Name
    } = user_data;

    const data = {
        name: chalk.bold.green(`                        ${Name}`),
        work: `${chalk.white(`${job_title}`)}`,
        twitter: chalk.gray("https://twitter.com/") + chalk.cyan(`${twitter_username}`),
        github: chalk.gray("https://github.com/") + chalk.green(`${github_username}`),
        linkedin: chalk.gray("https://linkedin.com/in/") + chalk.blue(`${linkedin_username}`),
        web: chalk.cyan(`${personal_site}`),
        npx: chalk.red("npx") + " " + chalk.white(`${npx_card_handle}`),
        labelWork: chalk.white.bold("       Work:"),
        labelTwitter: chalk.white.bold("    Twitter:"),
        labelGitHub: chalk.white.bold("     GitHub:"),
        labelLinkedIn: chalk.white.bold("   LinkedIn:"),
        labelWeb: chalk.white.bold("        Web:"),
        labelCard: chalk.white.bold("       Card:"),
    };

    const me = boxen(
        [
            `${data.name}`,
            ``,
            `${data.labelWork}  ${data.work}`,
            ``,
            `${data.labelTwitter}  ${data.twitter}`,
            `${data.labelGitHub}  ${data.github}`,
            `${data.labelLinkedIn}  ${data.linkedin}`,
            `${data.labelWeb}  ${data.web}`,
            ``,
            `${data.labelCard}  ${data.npx}`,
            ``,
            `${chalk.italic("I am currently looking for new opportunities,")}`,
            `${chalk.italic("my inbox is always open. Whether you have a")}`,
            `${chalk.italic("question or just want to say hi, I will try ")}`,
            `${chalk.italic("my best to get back to you!")}`,
        ].join("\n"),
        {
            margin: 1,
            float: "center",
            padding: 1,
            borderStyle: "single",
            borderColor: "green",
        }
    );

    console.log(me);
    const menuOptions = [
        `Send me an ${chalk.green.bold("email")}`,
        `Download my ${chalk.magentaBright.bold("Resume")}`,
        "Just quit",
    ];

    const response = await prompt({
        type: "select",
        name: "action",
        message: "What you want to do?",
        choices: menuOptions,
    });

    switch (response.action) {
        case `Send me an ${chalk.green.bold("email")}`:
            open(`mailto:${user_data.user_email}`);
            console.log("\nDone, see you soon at the inbox.\n");
            break;
        case `Download my ${chalk.magentaBright.bold("Resume")}`:
            const loader = ora({
                text: " Downloading Resume",
                spinner: cliSpinners.material,
            }).start();
            const resume_url = "https://raw.githubusercontent.com/Sinister-00/Personal_NPX_Card/main/Swapnil_s_Resume.pdf";
            const pipe = request(resume_url).pipe(fs.createWriteStream(`./Swapnil_s_Resume.pdf`));

            pipe.on("finish", function () {
                let downloadPath = path.join(
                    process.cwd(),
                    `${npx_card_handle}-Swapnil_s_Resume.pdf`
                );
                console.log(`\nResume Downloaded at ${downloadPath} \n`);
                open(downloadPath);
                loader.stop();
            });
            break;
        case "Just quit":
            console.log("Hasta la vista.\n");
            break;
    }
};

main().catch((error) => {
    console.error("An error occurred: ", error);
});