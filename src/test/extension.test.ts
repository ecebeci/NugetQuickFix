import * as assert from 'assert';
import * as vscode from 'vscode';
import * as sinon from 'sinon';
import axios from 'axios';
import { searchNugetPackages } from '../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	suite('searchNugetPackages Tests', () => {
		let showErrorMessageStub: sinon.SinonStub;
		let axiosGetStub: sinon.SinonStub;

		setup(() => {
			showErrorMessageStub = sinon.stub(vscode.window, 'showErrorMessage');
			axiosGetStub = sinon.stub(axios, 'get');
		});

		teardown(() => {
			sinon.restore();
		});

		test('Returns up to 5 packages when axios succeeds', async () => {
			axiosGetStub.resolves({
				data: {
					data: [
						{id: 'TestPkg1'}, {id: 'TestPkg2'},
						{id: 'TestPkg3'}, {id: 'TestPkg4'},
						{id: 'TestPkg5'}, {id: 'TestPkg6'}
					]
				}
			});
			const result = await searchNugetPackages('Test');
			assert.strictEqual(result.length, 5);
			assert.strictEqual(showErrorMessageStub.called, false);
		});

		test('Returns undefined and shows error message when axios fails', async () => {
			axiosGetStub.rejects(new Error('Network Error'));
			const result = await searchNugetPackages('Test');
			assert.strictEqual(result, undefined);
			assert.strictEqual(showErrorMessageStub.called, true);
		});
	});
});
