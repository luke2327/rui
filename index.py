import discord
import asyncio

client = discord.Client()

@client.event
async def on_ready():
  print('run ...')

@client.event
async def on_message(msg):
  if msg.content.startswith('!test'):
    await client.send_message(msg.channel, 'test success!')

client.run('Njc4MjE4NDQ1MzE3MzQxMTk3.XkjXtA.ErxM4XrHNsm29jq6mBBugSYhMps')