---
title: "How to have multiple SSH keys for different GitHub accounts"
date: 2020-05-20
lang: en
---

## Context

Earlier this month, I started working for a company that hosts its code in private Github repositories, and therefore I had 2 choices: having my current Github account given the permissions to view those repositories, or creating a separate account, dedicated to work.  
As I wanted to keep my personal repositories separate (because I'll be accessing them during my vacation / week-ends, and I don't want to have my work repositories appears alongside them in the Github web UI), I chose the second option.

I then realized that I wanted to be able to have read and write access to some of my personal repositories from my work machine (mainly, my dotfiles and my personal notes). Therefore I had to find a way of using different keys to access GitHub trough SSH, depending on the repository.

Using Google, I was able to find lots of resources that explained how to do that and gave examples of SSH config files for that use-case. However, I ran into issues that weren't covered by any of those resources, and that's why I think it's worth writing one more blog post on that issue.

## Setup

First, some notes about my setup:

- both keys are stored in `~/.ssh/` folder, and are encrypted using passphrases
- my work key is `id_rsa` and my personal key is `id_rsa_personal`

The desired behavior is:

- use my personal key when pulling from / pushing to my personal repositories
- use my work key in all other contexts

## First try

The first version of my `.ssh/config` file was:

```
Host github-personal
    User git
    HostName github.com
    IdentityFile ~/.ssh/id_rsa_personal

Host *
    IdentityFile ~/.ssh/id_rsa
    AddKeysToAgent yes
    UseKeychain yes
```

The idea was that I would be able to access my personal repositories by cloning them using `git clone github-personal:puigfp/repo.git`, and access my work repositories by cloning them using `git clone git@github.com:work/repo.git`.

## Issues

Unfortunately, I discovered two behaviors of the SSH client that made this config file not work as I intended it to.

### First behavior

The first behavior is that, by default, the SSH client doesn't only try to authenticate using the key(s) specified in your config, but also with the other keys loaded in your SSH agent.

For instance, if my work key is loaded in my SSH agent and I run `git clone github-personal:puigfp/repo.git`, the SSH client may try to authenticate using my work key before trying with my personal key.

When it happens, the authentication succeeds, because my work key is associated with a github account, but the clone fails with:

```
ERROR: Repository not found.
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

The configuration option for preventing this behavior is `IdentitiesOnly`. The [ssh_config man page](https://linux.die.net/man/5/ssh_config) reads:

```
IdentitiesOnly

Specifies that ssh(1) should only use the authentication identity files configured in the ssh_config files, even if ssh-agent(1) offers more identities. The argument to this keyword must be ''yes'' or ''no''. This option is intended for situations where ssh-agent offers many different identities. The default is ''no''.
```

Therefore, I added the following lines at the end of my config:

```
Host *
    IdentitiesOnly yes
```

### Second behavior

After adding those lines, I repeated the `git clone` experiment and... it yielded the same result.

After a some googling, I found out that the `IdentityFile` option didn't behave as I thought it did.

The [ssh_config man page](https://linux.die.net/man/5/ssh_config) reads:

```
For each parameter, the first obtained value will be used.
```

That's why I assumed that my config file told the SSH client to use my personal key to access the `github-personal` host and my work key to access any other host.

It turns out that this isn't true for all parameters. The section about the `IdentityFile` parameter reads:

```
It is possible to have multiple identity files specified in configuration files; all these identities will be tried in sequence.
```

When I try to access `github-personal` using SSH, both the `Host github-personal` section and `Host *` section will be read sequentially and taken into account. Therefore, my config actually tells the SSH client that both my work key and my personal key can be used to authenticate.

The fix is to move the `IdentityFile ~/.ssh/id_rsa` statement under a separate section, with a stricter filter:

```
Host * !github-personal
    IdentityFile ~/.ssh/id_rsa
```

## Wrapping up

A working SSH config for this use-case is:

```
Host github-personal
    User git
    HostName github.com
    IdentityFile ~/.ssh/id_rsa_personal

Host * !github-personal
    IdentityFile ~/.ssh/id_rsa

Host *
    AddKeysToAgent yes
    UseKeychain yes
    IdentitiesOnly yes
```
