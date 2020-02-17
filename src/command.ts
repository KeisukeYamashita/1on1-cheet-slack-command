
export type commandType = 'help'

export async function help(): Promise<Record<string, string>> {
  return {
    'text': 'hello',
  };
}

export default {
  help,
};
