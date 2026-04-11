import * as core from '@actions/core';
import * as exec from '@actions/exec';

async function installClaudeCode(version: string): Promise<void> {
  const pkg = version === 'latest' ? '@anthropic-ai/claude-code' : `@anthropic-ai/claude-code@${version}`;
  core.info(`Installing ${pkg}...`);
  const returnCode = await exec.exec('npm', ['install', '-g', pkg]);
  if (returnCode !== 0) {
    throw new Error(`Failed to install ${pkg}`);
  }
}

async function setup(): Promise<void> {
  try {
    const version = core.getInput('version') || 'latest';
    await installClaudeCode(version);

    const apiKey = core.getInput('anthropic-api-key');
    if (apiKey) {
      core.exportVariable('ANTHROPIC_API_KEY', apiKey);
      core.setSecret(apiKey);
    }

    core.info('Claude Code setup complete.');
  } catch (e) {
    core.setFailed(e as string | Error);
  }
}

if (require.main === module) {
  // eslint-disable-next-line no-void
  void setup();
}
