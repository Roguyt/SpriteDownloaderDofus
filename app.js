const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const http = require('http');
const cheerio = require('cheerio');
const exec = require('child_process');
const sizeOf = require('image-size');
const prompt = require('prompt');

prompt.start();

prompt.get(['url'], (err, result) => {
	main(result.url);
});

function main(url) {
	request(url, (err, req, res) => {
		let $ = cheerio.load(res);
		let href = [];
		$('.ak-monster-spells .ak-title a').each(function() {
			href.push($(this).attr('href'));
		});
		let name = $('.ak-return-link').text().trim() + '-';
		name = name.replace(/ /g, '');
		href = _.uniqBy(href, (e) => { return e; });
		for (let i = 0; i < href.length; i++) {
			let file = fs.createWriteStream('./output/' + name + i + '.png');
			http.get(href[i], (res) => {
				res.pipe(file).on('close', () => {
					console.log('Done.');
					let dim = sizeOf('./output/' + name + i + '.png');
					dim = dim.width / 195;
					let delay = 120 / dim;
					console.log(dim);
					console.log(delay);
					exec.execFileSync('cmd.bat', [
							name + i,
							delay
						], {
							cwd: './output'
						}, (err, stdout, stderr) => {
						console.log(err);
						console.log(stdout);
						console.log(stdout);
					});
				});
			});
		}
	});
}